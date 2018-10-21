import crypto from 'crypto';

export default function (sequelize, DataTypes) {
    function generateMyId() {
        return crypto.randomBytes(8).toString('hex');
    }
    const User = sequelize.define('user', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue() {
                return generateMyId();
            },
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                len: {
                    args: [3, 50],
                    msg: 'The User Name accepts 3 to 50 characters. No whitespace.',
                },
                is: {
                    args: [/^[a-zA-Z0-9@._-\d\-_\s]+$/i],
                    msg: 'The User Name accepts only alphabets, numbers, ., @, - and _. No whitespace.',
                },
            },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: {
                    args: true,
                    msg: 'The input is not valid E-mail!',
                },
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [8, 100],
                    msg: 'The Password accepts 8 to 100 characters.',
                },
            },
        },
    });

    /** User.associate = (models) => {
        User.belongsToMany(models.account, {
            through: models.member,
            foreignKey: {
                name: 'userId',
                field: 'userId',
            },
        });

        User.belongsToMany(models.role, {
            through: 'roleUsers',
            foreignKey: 'userId',
        });
    };*/

    return User;
}