# import config.
# You can change the default config with `make cnf="config_special.env" build`
cnf ?= config.env
include $(cnf)
export $(shell sed 's/=.*//' $(cnf))

# DOCKER TASKS
# Build the container
runzookeeper: ## Run container on port configured in `config.env`
	docker run -i -t --rm --env-file=./config.env -p=$(ZOOKEEPER_TARGET_PORT):$(ZOOKEEPER_DOCKER_PORT) --name="$(ZOOKEEPER_APP_NAME)" $(ZOOKEEPER_DOCKER_IMAGE)
runkafka: ## Run container on port configured in `config.env`
	docker run -i -t --rm --env-file=./config.env -p=$(KAFKA_TARGET_PORT):$(KAFKA_DOCKER_PORT) --name="$(KAFKA_APP_NAME)" $(KAFKA_DOCKER_IMAGE)


up: build run ## Run container on port configured in `config.env` (Alias to run)

stop: ## Stop and remove a running container
	docker stop $(APP_NAME); docker rm $(APP_NAME)



# Node
publish:
	npm run publish $(MSG)
consume:
	npm run consume