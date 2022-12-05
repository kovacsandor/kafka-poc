import { model, Document, Model, Schema, ObjectId } from "mongoose";

export interface TestObject {
  readonly name: string;
}

export interface KafkaOffset {
  readonly _kafkaOffset: number;
}

export interface TestObjectDocument
  extends Document<ObjectId, any, TestObject> {}

interface TestObjectModel extends Model<TestObjectDocument> {
  readonly createDocument: (
    attrs: TestObject & KafkaOffset
  ) => TestObjectDocument;
}

const testObjectSchema = new Schema({
  _kafkaOffset: {
    required: true,
    type: Number,
  },
  name: {
    required: true,
    type: String,
  },
});

testObjectSchema.statics.createDocument = (
  attrs: TestObject & KafkaOffset
): TestObjectDocument => new testObjectModel(attrs);

export const testObjectModel = model<TestObjectDocument, TestObjectModel>(
  "TestObject",
  testObjectSchema
);
