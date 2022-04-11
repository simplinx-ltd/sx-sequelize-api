import { Model } from 'sequelize-typescript';
export default class TestModel extends Model<TestModel> {
    topicName: string;
    comment: string;
}
