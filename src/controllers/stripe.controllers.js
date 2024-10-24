
const stripeController = {
    async test(req, res, next){
        console.log(req.body);
        console.log('metadata', req.body.data);
    }
}

export default stripeController;