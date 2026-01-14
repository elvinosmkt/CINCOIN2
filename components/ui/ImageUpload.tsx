
import React, { useRef, useState } from 'react';
import { UploadCloud, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../lib/utils';

interface ImageUploadProps {
  value?: string;
  onChange: (base64: string) => void;
  label?: string;
  className?: string;
  placeholder?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ 
  value, 
  onChange, 
  label, 
  className,
  placeholder = "Clique para selecionar ou arraste a imagem"
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    // Validar tipo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    // Validar tamanho (ex: 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB.');
        return;
    }

    setIsLoading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result as string);
      setIsLoading(false);
    };
    reader.onerror = () => {
        alert('Erro ao ler o arquivo.');
        setIsLoading(false);
    }
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovering(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovering(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovering(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange('');
      if (fileInputRef.current) {
          fileInputRef.current.value = '';
      }
  };

  return (
    <div className={cn("w-full space-y-2", className)}>
      {label && <label className="text-sm font-medium">{label}</label>}
      
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col items-center justify-center w-full min-h-[160px] rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden group bg-muted/20",
          isHovering ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50",
          value ? "border-solid p-0" : "p-6"
        )}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*"
          onChange={handleFileChange}
        />

        {isLoading ? (
            <div className="flex flex-col items-center gap-2 text-muted-foreground animate-pulse">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="text-xs">Processando imagem...</span>
            </div>
        ) : value ? (
            // Preview State
            <div className="relative w-full h-full min-h-[200px] flex items-center justify-center bg-black/5">
                <img 
                    src={value} 
                    alt="Preview" 
                    className="w-full h-full object-contain max-h-[300px]" 
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button type="button" variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                        Trocar
                    </Button>
                    <Button type="button" variant="destructive" size="sm" onClick={handleRemove}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        ) : (
            // Empty State
            <div className="flex flex-col items-center justify-center text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <UploadCloud className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">
                        {placeholder}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        SVG, PNG, JPG ou GIF (max. 5MB)
                    </p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
