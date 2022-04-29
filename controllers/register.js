const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        return res.status(400).json('incorrect form submission');
    }
    const hash = bcrypt.hashSync(password);
        // console.log('hash', hash, 'email', email, 'password', password);
        // console.log('db', db.transaction);
        db.transaction(trx => {
            // console.log('people')
            trx.insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                .returning('*')
                .insert({
                email: loginEmail[0],
                name: name,
                joined: new Date()
            })
            .then(user => {
                // console.log('returning user')
                res.json(user[0]);
            }) 
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('unable to register'))
}

module.exports = {
    handleRegister: handleRegister
}
