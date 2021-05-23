
# Default print the help
.DEFAULT_GOAL := help



# Self-documentation trick (https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html)
help: ## This help (default)
	@echo
	@echo "Decredex Blockchain"
	@echo
	@echo "Options:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z0-9_-]+:.*?## / {printf "\033[36m%-24s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo



#############################
###    BUILD COMMANDS     ###
#############################

compile: ## Compile all smart contracts
	npx truffle compile
	@echo "=== Build finished ===\n"

migrate: compile ## Migrate the smart contracts to ganache network
	npx truffle migrate
	@echo "=== Migrate completed ===\n"

copy-abi: ## Copy build artifacts over to decredex portal app
	cp build/contracts/Decredex.json ../decredex-portal/src/abi/
	@echo "=== Copy completed ===\n"



#############################
###     RUN COMMANDS      ###
#############################

console: ## Connect console to the local ganache network
	@echo "=== Connecting console ... ==="
	npm run truffle console

testnet: ## Run local ganache network
	@echo "=== Running local ganache instance (blocktime = 0s) ===\n"
	docker run --rm -p "8545:8545" --name decredex-testnet trufflesuite/ganache-cli -d --networkId 920717 -m "paddle jacket size mask fetch fantasy cruel answer flight bless north rain"

demonet: ## Run local ganache network with "realistic" blocktimes
	@echo "=== Running local ganache instance (blocktime = 3s) ===\n"
	docker run --rm -p "8545:8545" --name decredex-demonet trufflesuite/ganache-cli -b 3 --networkId 920717 -d -m "paddle jacket size mask fetch fantasy cruel answer flight bless north rain"

test: compile ## Run the testsuite on a running ganache network
	@echo "=== Running test suite ==="
	npx truffle test
