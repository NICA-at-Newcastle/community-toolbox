mongosh -- "$MONGO_INITDB_DATABASE" <<EOF
    var rootUser = '$MONGO_INITDB_ROOT_USERNAME';
    var rootPassword = '$MONGO_INITDB_ROOT_PASSWORD';
    var admin = db.getSiblingDB('admin');
    admin.auth(rootUser, rootPassword);

    var user = '$MONGODB_APPLICATION_USER';
    var passwd = '$MONGODB_APPLICATION_PASS';
    db.createUser({user: user, pwd: passwd, roles: ["readWrite"]});
EOF