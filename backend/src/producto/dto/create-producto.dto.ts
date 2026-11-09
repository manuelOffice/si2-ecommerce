export class CreateProductoDto {
	precio: number;
	nombre: string;
	marca?: string;
	talla?: string;
	color?: string;
	material?: string;
	categoria_id?: number;
}
