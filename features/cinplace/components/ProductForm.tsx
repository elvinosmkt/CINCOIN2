
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { ImageUpload } from '../../../components/ui/ImageUpload';
import { CinPlaceProduct, CATEGORIES } from '../../../types/cinplace';
import { Tag } from 'lucide-react';

const productSchema = z.object({
  name: z.string().min(3, "Nome muito curto"),
  description: z.string().min(10, "Descrição deve ser mais detalhada"),
  priceFiat: z.string().transform((val) => Number(val)).refine((val) => val > 0, "Preço inválido"),
  discountPercent: z.string().transform((val) => Number(val)).optional(),
  category: z.string().min(1, "Selecione uma categoria"),
  imageUrl: z.string().min(1, "A imagem do produto é obrigatória"), // Validação simples de string
  acceptType: z.enum(['FIXED', 'RANGE']),
  fixedCinPercent: z.string().transform(Number).optional(),
  minCinPercent: z.string().transform(Number).optional(),
  maxCinPercent: z.string().transform(Number).optional(),
  allowNegotiation: z.boolean().default(false),
}).refine((data) => {
  if (data.acceptType === 'FIXED') {
    return data.fixedCinPercent !== undefined && data.fixedCinPercent >= 0 && data.fixedCinPercent <= 100;
  } else {
    return (
      data.minCinPercent !== undefined && 
      data.maxCinPercent !== undefined && 
      data.minCinPercent < data.maxCinPercent &&
      data.maxCinPercent <= 100
    );
  }
}, {
  message: "Configuração de percentual inválida",
  path: ["acceptType"]
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: CinPlaceProduct;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  onCancel: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSubmit, isLoading, onCancel }) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData ? {
        ...initialData,
        priceFiat: String(initialData.priceFiat) as any,
        discountPercent: String(initialData.discountPercent || 0) as any,
        fixedCinPercent: String(initialData.fixedCinPercent) as any,
        minCinPercent: String(initialData.minCinPercent) as any,
        maxCinPercent: String(initialData.maxCinPercent) as any,
    } : {
        acceptType: 'FIXED',
        allowNegotiation: false,
        category: CATEGORIES[0],
        discountPercent: "0" as any,
        imageUrl: "" 
    }
  });

  const acceptType = watch('acceptType');
  const imageUrl = watch('imageUrl');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Nome do Item / Benefício" {...register('name')} error={errors.name?.message} />
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Descrição Detalhada</label>
        <textarea 
            className="w-full bg-background border border-input rounded-md p-2 text-sm"
            rows={3}
            placeholder="Descreva o produto ou benefício..."
            {...register('description')}
        />
        {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
         <Input label="Preço Original (R$)" type="number" {...register('priceFiat')} error={errors.priceFiat?.message} />
         <div className="space-y-2">
             <label className="text-sm font-medium">Categoria</label>
             <select {...register('category')} className="w-full h-10 bg-background border border-input rounded-md px-3 text-sm">
                 {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
             </select>
         </div>
      </div>

      <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-lg">
         <div className="flex items-center gap-2 mb-2">
            <Tag className="h-4 w-4 text-green-600" />
            <h4 className="font-semibold text-sm text-green-700">Oferecer Desconto (Opcional)</h4>
         </div>
         <Input 
             label="Desconto em % (aplica sobre o valor em R$)" 
             type="number" 
             min="0" 
             max="100" 
             {...register('discountPercent')} 
         />
         <p className="text-[10px] text-muted-foreground mt-1">Ex: Aceito 20% em Cincoin + 10% de Desconto no valor total.</p>
      </div>

      {/* Image Upload Replacement */}
      <div className="space-y-2">
         <ImageUpload 
            label="Foto do Produto" 
            value={imageUrl} 
            onChange={(base64) => setValue('imageUrl', base64, { shouldValidate: true })} 
            placeholder="Clique para adicionar a foto do item"
         />
         {errors.imageUrl && <p className="text-xs text-destructive">{errors.imageUrl.message}</p>}
      </div>

      <div className="p-4 border rounded-lg bg-muted/20 space-y-4">
         <h4 className="font-semibold text-sm">Regras de Aceitação (Cincoin)</h4>
         
         <div className="flex gap-4">
             <label className="flex items-center gap-2 text-sm cursor-pointer">
                 <input type="radio" value="FIXED" {...register('acceptType')} className="accent-primary" />
                 Percentual Fixo
             </label>
             <label className="flex items-center gap-2 text-sm cursor-pointer">
                 <input type="radio" value="RANGE" {...register('acceptType')} className="accent-primary" />
                 Faixa (Range)
             </label>
         </div>

         {acceptType === 'FIXED' ? (
             <Input label="% Fixo em Cincoin" type="number" min="0" max="100" {...register('fixedCinPercent')} />
         ) : (
             <div className="flex gap-4">
                <Input label="Mínimo %" type="number" min="0" max="100" {...register('minCinPercent')} />
                <Input label="Máximo %" type="number" min="0" max="100" {...register('maxCinPercent')} />
             </div>
         )}
         {errors.acceptType && <p className="text-xs text-destructive">{errors.acceptType.message}</p>}

         <label className="flex items-center gap-2 text-sm cursor-pointer border-t border-border pt-4">
             <input type="checkbox" {...register('allowNegotiation')} className="rounded border-input accent-primary" />
             Permitir que compradores enviem contra-propostas fora dessas regras
         </label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
         <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
         <Button type="submit" isLoading={isLoading}>Salvar Item</Button>
      </div>
    </form>
  );
};
