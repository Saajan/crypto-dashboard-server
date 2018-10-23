export default function (sequelize, DataTypes) {
    const Account = sequelize.define('account', {
        userId: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        BTC: {
            type: DataTypes.REAL,
            defaultValue: 0
        },
        ETH: {
            type: DataTypes.REAL,
            defaultValue: 0
        },
        LTC: {
            type: DataTypes.REAL,
            defaultValue: 0
        },
        BCH: {
            type: DataTypes.REAL,
            defaultValue: 0
        },
        ETC: {
            type: DataTypes.REAL,
            defaultValue: 0
        },
    },{
        timestamps: false,
    });
    return Account;
}