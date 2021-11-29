import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    sku: string

    @Column()
    barcode: string

    @Column()
    price_purchase: number

    @Column()
    price_sale: number

    @Column()
    description: string

    @Column()
    qty: number

    @Column()
    image: string

    @Column()
    image_string: string

    @CreateDateColumn()
    create_at: Date

    @UpdateDateColumn({ onUpdate: "CURRENT_TIMESTAMP(6)" })
    update_at: Date

    @ManyToOne(() => User, data => data.id)
    user: User


}
