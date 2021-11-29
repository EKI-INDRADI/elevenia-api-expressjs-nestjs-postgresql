module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            name: String,
            email: String,
            username: String,
            password: String, 
        }
    );

    schema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const model = mongoose.model("user", schema);
    return model;
};
