const LIMIT = 5

const DeviceHandlers = deviceRepo => {
    return [
        {
            method: 'get',
            path: '/devices',
            handler: getDevices(deviceRepo)
        },
        {
            method: 'post',
            path: '/devices/:id',
            handler: uploadDevice(deviceRepo)
        }
    ]
}

const getDevices = deviceRepo => (req, res) => {
    console.log('devices')
    const query = req.query
    const page = parseInt(query.page || 0)

    deviceRepo.fetchPage(LIMIT, page)
        .then(result => {
            if (result.ok) {
                res.json(result.msg)
            } else {
                console.log(result.msg)
                res.status(500).send('GET Member Error')
            }
        })
}

const uploadDevice = deviceRepo => (req, res) => {
    console.log('upload device')
    const add = req.query.addNew || false
    const device = req.body
    const id = parseInt(req.params.id)
    if (!add && id !== parseInt(device.id)) {
        return res.json({
            code: 'FAILED',
            msg: 'Mismatch ID'
        })
    }
    if (add) {
        deviceRepo.addOne(device)
            .then(result => {
                if (result.ok) {
                    res.json({ code: 'OK' })
                } else {
                    console.log(result.msg)
                    res.json({ code: 'FAILED', msg: result.msg })
                }
            })
    } else {
        deviceRepo.updateOne({ id }, device)
            .then(result => {
                if (result.ok) {
                    res.json({ code: 'OK' })
                } else {
                    console.log(result.msg)
                    res.json({ code: 'FAILED', msg: result.msg })
                }
            })
    }
}

module.exports = {
    DeviceHandlers
}