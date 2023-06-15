const fs = require('fs');
const axios = require('axios');
const stackContent = fs.readFileSync('deploy/stack.yaml', 'utf-8');
const version = process.argv[2] || 'latest';
const host = 'http://10.100.7.8:9000';


async function getToken() {
    const data = JSON.stringify({ username: 'admin', password: 'admin123' });
    const config = {
        method: 'post',
        url: `${host}/api/auth`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    return await new Promise((solve, reject) => {
        axios(config)
            .then(function (response) {
                solve(response?.data?.jwt || null);
            })
            .catch(function (error) {
                throw new Error(error);
            });
    });
}

async function deploy() {
    const data = JSON.stringify({
        "id": 10,
        "StackFileContent": stackContent,
        "Env": [
            {
                "name": "FE_VERSION",
                "value": version
            }
        ],
        "Prune": false
    });
    const config = {
        method: 'put',
        url: `${host}/api/stacks/10?endpointId=2`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await getToken()}`
        },
        data: data
    };

    return await new Promise((solve, reject) => {
        axios(config)
            .then(function (response) {
                console.log(`Deploy success version ${version}`);
                solve(true);
            })
            .catch(function (error) {
                throw new Error(error);
            });
    });
}

deploy()