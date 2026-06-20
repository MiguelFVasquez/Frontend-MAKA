export interface ReportType {
  id: string;
  title: string;
  description: string;
  fields: ReportField[];
}

export interface ReportField {
  name: string;
  label: string;
  type: 'date' | 'select' | 'checkbox' | 'text';
  options?: { value: string; label: string }[];
  required?: boolean;
}