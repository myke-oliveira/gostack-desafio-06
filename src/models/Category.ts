import { Column, Entity } from "typeorm";

@Entity('categories')
class Category {
  @Column()
  id: string;

  @Column()
  title: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Category;
