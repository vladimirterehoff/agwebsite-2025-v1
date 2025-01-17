export default function handler(req : any, res : any) {
    console.log(JSON.stringify(req.body));
    res.status(200).json({status : 200});
}