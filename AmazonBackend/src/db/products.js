export default (sequelize, DataTypes) => {
	const Product = sequelize.define("product", {
		_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		name: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		brand: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		imageUrl: {
			type: DataTypes.TEXT,
			allowNull: false,
			validate: {
				isUrl: {
					msg: "Image URL is not an URL",
				},
			},
		},
		price: {
			type: DataTypes.DOUBLE,
			allowNull: false,
		},
	})
	return Product
}
