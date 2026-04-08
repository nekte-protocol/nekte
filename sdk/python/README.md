# NEKTE Python SDK

Python SDK for the NEKTE agent-to-agent coordination protocol.

## Installation

```bash
pip install nekte
```

## Quick Start

```python
from nekte import NekteClient

client = NekteClient("http://localhost:4001")
catalog = await client.catalog()
result = await client.invoke("sentiment", input={"text": "Great product!"})
```

## Documentation

See the [main NEKTE documentation](https://github.com/nekte-protocol/nekte) for full protocol details.

## License

MIT
