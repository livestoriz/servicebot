//takes in a request and outputs the updated instance

//todo: move property system into plugins.
let getHandlers = function(handlerArray){
    if(!handlerArray){
        console.error("Handlers not provided..");
    }
    return handlerArray.reduce((acc, handler) => {
        acc[handler.name] = handler;
        return acc;
    }, {});
};
module.exports = {
    validateProperties: function (properties, handlerArray) {
        let handlers = getHandlers(handlerArray);
        return properties.reduce((acc, prop) => {
            //todo: reduce duplicate code that exists here and in webpack code.

            if (!handlers[prop.type]) {
                return acc;
            }
            const validator = handlers[prop.type].validator;
            if (validator) {
                const validationResult = validator(prop.data, prop.config)
                if (validationResult != true) {
                    prop.error = validationResult;
                    acc.push(prop);
                }

            }
            return acc;
        }, [])
    },
    getPriceAdjustments: function (properties, handlerArray) {
        let handlers = getHandlers(handlerArray);
        if(properties) {
            return properties.reduce((acc, prop) => {
                if (handlers[prop.type] && handlers[prop.type].priceHandler && prop.config && prop.config.pricing) {
                    const adjuster = handlers[prop.type].priceHandler;
                    acc.push({
                        name: prop.name,
                        type: prop.type,
                        operation: prop.config.pricing.operation,
                        value: adjuster(prop.data, prop.config)
                    });
                }
                return acc;
            }, [])
        }else{
            return [];
        }
    }
};

