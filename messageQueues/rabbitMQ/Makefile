# import config.
# You can change the default config with `make cnf="config_special.env" build`
cnf ?= config.env
include $(cnf)
export $(shell sed 's/=.*//' $(cnf))

# DOCKER TASKS
# Build the container
run: ## Run container on port configured in `config.env`
	docker run -i -t --rm --env-file=./config.env -p=$(TARGET_PORT):$(DOCKER_RABITMQ_PORT) --name="$(APP_NAME)" $(DOCKER_RABBITMQ_IMAGE)


up: build run ## Run container on port configured in `config.env` (Alias to run)

stop: ## Stop and remove a running container
	docker stop $(APP_NAME); docker rm $(APP_NAME)



# Node
publish:
	npm run publish $(MSG)
consume:
	npm run consume