/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
    tableName: 'test',
    modelName: 'test',
    freezeTableName: true,
})
export default class TestModel extends Model<TestModel> {
    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    topicName: string;

    @Column(DataType.TEXT)
    comment: string;
}
