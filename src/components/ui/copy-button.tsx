'use client';

import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import { toast } from 'sonner';

interface CopyButtonProps {
  value: string;
  copied?: boolean;
  onCopy?: () => void;
}

export function CopyButton({ value, copied = false, onCopy }: CopyButtonProps) {
  const { t } = useTranslation('common');

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(value);
    onCopy?.();
    toast.success(t('copied'));
  }, [value, onCopy, t]);

  return (
    <Button onClick={handleCopy} className="w-fit gap-2">
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {copied ? t('copied') : t('copy')}
    </Button>
  );
}
