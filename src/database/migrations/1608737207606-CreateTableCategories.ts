import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from "typeorm";

export default class CreateTableCategories1608737207606 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: 'categories',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_v4()',
            },
            {
              name: 'title',
              type: 'varchar',
            },
            {
              name: 'created_at',
              type: 'timestamp',
              default: 'now()',
            },
            {
              name: 'updated_at',
              type: 'timestamp',
              default: 'now()',
            },
          ],
        }),
      );

      await queryRunner.addColumn('transactions', new TableColumn({
        name: 'category_id',
        type: 'uuid',
      }));

      await queryRunner.createForeignKey('transactions', new TableForeignKey({
        name: 'EachTransactionBelongToOneCategory',
        columnNames: ['category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'categories',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropForeignKey(
        'transactions',
        'EachTransactionBelongToOneCategory',
      );

      await queryRunner.dropColumn('transactions', 'category_id');

      await queryRunner.dropTable('categories');
    }

}
