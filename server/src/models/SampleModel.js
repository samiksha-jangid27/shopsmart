// A simple mock model structure
class SampleModel {
  static async find() {
    return [{ id: 1, name: "Sample Item" }];
  }
}

module.exports = SampleModel;
