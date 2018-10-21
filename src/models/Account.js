export default function (sequelize, DataTypes) {
    const Account = sequelize.define('account', {
        userId: {
            type: DataTypes.UUID,
            primaryKey: true
        },
    });
    return Account;
}