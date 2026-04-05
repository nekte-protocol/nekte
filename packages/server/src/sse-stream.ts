/**
 * SSE Stream — Server-Sent Events writer for NekteServer
 *
 * Wraps an HTTP ServerResponse to emit typed NEKTE SSE events.
 * Used for streaming delegate results back to the client.
 *
 * @example
 * ```ts
 * const stream = new SseStream(res);
 * stream.progress(50, 500, 'Processing reviews...');
 * stream.partial({ preliminary_score: 0.72 });
 * stream.complete('task-001', { minimal: '72% positive', compact: {...}, full: {...} });
 * ```
 */

import type { ServerResponse } from 'node:http';
import type { DetailLevel, MultiLevelResult, SseEvent } from '@nekte/core';
import { encodeSseEvent, SSE_CONTENT_TYPE } from '@nekte/core';

export class SseStream {
  private res: ServerResponse;
  private closed = false;

  constructor(res: ServerResponse) {
    this.res = res;
    this.res.writeHead(200, {
      'Content-Type': SSE_CONTENT_TYPE,
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // disable nginx buffering
    });
  }

  /** Send a progress event */
  progress(processed: number, total: number, message?: string): void {
    this.send({
      event: 'progress',
      data: { processed, total, ...(message && { message }) },
    });
  }

  /** Send a partial result (preliminary data) */
  partial(out: Record<string, unknown>, resolvedLevel?: DetailLevel): void {
    this.send({
      event: 'partial',
      data: { out, ...(resolvedLevel && { resolved_level: resolvedLevel }) },
    });
  }

  /** Send completion event and close the stream */
  complete(
    taskId: string,
    out: MultiLevelResult,
    meta?: { ms?: number; tokens_used?: number },
  ): void {
    this.send({
      event: 'complete',
      data: { task_id: taskId, status: 'completed', out, ...(meta && { meta }) },
    });
    this.close();
  }

  /** Send error event and close the stream */
  error(code: number, message: string, taskId?: string): void {
    this.send({
      event: 'error',
      data: { code, message, ...(taskId && { task_id: taskId }) },
    });
    this.close();
  }

  /** Send a raw SSE event */
  send(event: SseEvent): void {
    if (this.closed) return;
    this.res.write(encodeSseEvent(event));
  }

  /** Close the stream */
  close(): void {
    if (this.closed) return;
    this.closed = true;
    this.res.end();
  }

  /** Whether the stream has been closed */
  get isClosed(): boolean {
    return this.closed;
  }
}
