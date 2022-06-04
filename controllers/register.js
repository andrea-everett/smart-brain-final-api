const handleRegister = (req, res, db, bcrypt) => {
    console.log('handle register')
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        console.log('incorrect ')
        return res.status(400).json('incorrect form submission');
    }
    const hash = bcrypt.hashSync(password);
        // console.log('hash', hash, 'email', email, 'password', password);
        console.log('db', db.transaction);
        db.transaction(trx => {
            trx.insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                console.log("LoginEmail", loginEmail)
                return trx('users')
                .returning('*')
                .insert({
                email: loginEmail[0].email,
                name: name,
                joined: new Date()
            })
            .then(user => {
                console.log('returning user')
                res.json(user[0]);
            }) 
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => {
            console.log("Error",err)
            res.status(400).json('unable to register')
        }) 
}

module.exports = {
    handleRegister: handleRegister
}
