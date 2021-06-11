export default (sequelize, DataTypes) => {
	const Review = sequelize.define("review", {
		_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		comment: {
			type: DataTypes.STRING(64),
			allowNull: false,
		},
		rate: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				min: 1,
				max: 5,
			},
		},
	})
	return Review
}
