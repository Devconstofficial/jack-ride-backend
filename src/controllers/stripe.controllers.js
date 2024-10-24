
const stripeController = {
    async test(req, res, next){
        console.log(req.body);
        console.log('body', req.body.data);
        console.log('metadata', req.body.data.object.metadata)
    }
}

export default stripeController;