const express = require('express');
const fs = require('fs');

const app = express();

app.listen(3000, function() {
    console.log('server is running on port 3000!');
});

app.use(express.static('./public'));

app.get('/data', (req, res) => {
    fs.readFile('./goods.json', 'utf-8', (err, data) => {
        if (!err) {
            res.setHeader('Content-Type', 'Application/json');
            res.end(data);
        } else {
            console.log(err);
            end(JSON.stringify(err));
        }
    })
})

app.post('/data', (req, res) => {
    fs.readFile('./goods.json', 'utf-8', (err, data) => {
        if (!err) {
            const goods = JSON.parse(data);

            const id = goods.reduce((acc, good) => acc > good.id ? acc : good.id, 0);

            goods.push({
                id: id,
                title: req.body.title,
                price: req.body.price
            });

            fs.writeFile('./goods.json', JSON.stringify(goods), (err) => {
                if (!err) {
                    res.end();
                } else {
                    console.log(err);
                    end(JSON.stringify(err));
                }
            });

        } else {
            console.log(err);
            end(JSON.stringify(err));
        }
    })
});

app.get('/cart', (req, res) => {
    fs.readFile('./cart.json', 'utf-8', (err, data) => {
        if (!err) {
            res.setHeader('Content-Type', 'Application/json');
            res.end(data);
        } else {
            console.log(err);
            end(JSON.stringify(err));
        }
    })
});


app.post('/cart', (req, res) => {
    fs.readFile('./cart.json', 'utf-8', (err, data) => {
        if (!err) {
            const goods = JSON.parse(data);

            goods.push(req.body);
            console.log(req.body);

            fs.writeFile('./cart.json', JSON.stringify(goods), (err) => {
                if (!err) {
                    res.end();
                } else {
                    console.log(err);
                    end(JSON.stringify(err));
                }
            });

        } else {
            console.log(err);
            end(JSON.stringify(err));
        }
    })
});