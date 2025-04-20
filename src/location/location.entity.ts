import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, DeleteDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('locations')
export class Location {
 @PrimaryGeneratedColumn()
 @ApiProperty({ description: 'Unique identifier for the location' })
 id: number;

 @Column()
 @ApiProperty({ description: 'Building name' })
 building: string;

 @Column()
 @ApiProperty({ description: 'Location name' })
 locationName: string;

 @Column()
 @ApiProperty({ description: 'Location number' })
 locationNumber: string;

 @Column('float')
 @ApiProperty({ description: 'Area in square meters' })
 area: number;

 @ManyToOne(() => Location, (location) => location.children, { nullable: true })
 @JoinColumn({ name: 'parentId' })
 @ApiProperty({ description: 'Parent location (if any)' })
 parent: Location | null;

 @Column({ nullable: true })
 parentId: number;

 @OneToMany(() => Location, (location) => location.parent)
 @ApiProperty({ description: 'Child locations' })
 children: Location[];

 @DeleteDateColumn({ nullable: true })
 @ApiProperty({ description: 'Timestamp when the location was soft-deleted', required: false })
 deletedAt?: Date | null;
}