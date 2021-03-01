# import config.
# You can change the default config with `make cnf="config_special.env" build`
cnf ?= config.env
include $(cnf)
export $(shell sed 's/=.*//' $(cnf))

# DOCKER TASKS
# Build the container
runDB: ## Run container on port configured in `config.env`
	docker run -i -t --rm --env-file=./config.env -p=$(PG_PORT):$(DOCKER_PG_PORT) -e POSGRES_PASSWORD="$(PG_PASSWORD)" --name="$(PG)" $(DOCKER_PG_IMAGE)

stopDB: ## Stop and remove a running container
	docker stop $(PG); docker rm $(PG)

# Run node scripts
createPartion:
	npm run createPartion
populateCustomers:
	npm run populateCustomers