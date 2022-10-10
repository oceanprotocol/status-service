# Status Service

## Setup

To run the status service, you first need to duplicate the `.env.example` file and rename it as `.env`. You need to replace the following environmental variables:

- For each network you need to provider an RPC URL (`rpcUrl`).
- You need to create and save your own personal access token (`API_TOKEN_GITHUB`). See [this guide](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) on how to create the token. The token only needs to have read access for repos.
- In order to send notification emails, you need to replace the SMTP details with the details from your own mail provider.

You may also wish to change the following settings via the environmental variables:

- `INTERVAL` this is the time interval between each monitoring event.
- `BLOCK_TOLERANCE` this is the number of blocks behind a service can be before it generates a `WARNING` response. We check the indexed block number for both aquarius and the subgraph.
- `MIN_FAUCET_ETH` and `MIN_FAUCET_OCEAN` if the faucet ballance falls below these values it will generate a `WARNING` response.

## Running locally

To run the service locally, use the following command:

```Bash
npm i && npm run dev
```

### Force trigger the monitoring of all Ocean components.

```
GET: http://localhost:3000/forceUpdate
```

## Testing

You can test the status service with the following command:

```Bash
npm run test
```
