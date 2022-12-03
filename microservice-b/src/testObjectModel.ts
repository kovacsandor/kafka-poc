import {
  model,
  Document,
  Model,
  Schema,
  ObjectId,
} from "mongoose";

export interface TestObject {
  readonly name: string;
}

interface TestObjectDocument extends Document<ObjectId, any, TestObject> {}

interface TestObjectModel extends Model<TestObjectDocument> {
  readonly createDocument: (attrs: TestObject) => TestObjectDocument;
}

const testObjectSchema = new Schema({
  name: {
    required: true,
    type: String,
  },
});

testObjectSchema.statics.createDocument = (
  attrs: TestObject
): TestObjectDocument => new testObjectModel(attrs);

export const testObjectModel = model<TestObjectDocument, TestObjectModel>(
  "TestObject",
  testObjectSchema
);
