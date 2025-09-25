import React from 'react';

// Typography Component accepting a "variant" prop for different text elements
interface TypographyProps {
  variant:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'p'
    | 'blockquote'
    | 'lead'
    | 'large'
    | 'small'
    | 'muted'
    | 'inlineCode';
  className?: string;
  children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({ variant, className = '', children }) => {
  switch (variant) {
    case 'h1':
      return (
        <h1
          className={`scroll-m-20 text-balance text-4xl font-extrabold tracking-tight ${className}`}
        >
          {children}
        </h1>
      );
    case 'h2':
      return (
        <h2
          className={`scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 ${className}`}
        >
          {children}
        </h2>
      );
    case 'h3':
      return (
        <h3 className={`scroll-m-20 text-2xl font-semibold tracking-tight ${className}`}>
          {children}
        </h3>
      );
    case 'h4':
      return (
        <h4 className={`scroll-m-20 text-xl font-semibold tracking-tight ${className}`}>
          {children}
        </h4>
      );
    case 'p':
      return <p className={`leading-7 [&:not(:first-child)]:mt-6 ${className}`}>{children}</p>;
    case 'blockquote':
      return (
        <blockquote className={`mt-6 border-l-2 pl-6 italic ${className}`}>{children}</blockquote>
      );
    case 'lead':
      return <p className={`text-muted-foreground text-xl ${className}`}>{children}</p>;
    case 'large':
      return <div className={`text-lg font-semibold ${className}`}>{children}</div>;
    case 'small':
      return <div className={`text-sm font-medium leading-none ${className}`}>{children}</div>;
    case 'muted':
      return <p className={`text-muted-foreground text-sm ${className}`}>{children}</p>;
    case 'inlineCode':
      return (
        <code
          className={`bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold ${className}`}
        >
          {children}
        </code>
      );
    default:
      return <p className={className}>{children}</p>;
  }
};

// Generic List component
interface ListProps<T> {
  as?: 'ul' | 'ol';
  items: T[];
  renderItem?: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export function List<T>({ as: Component = 'ul', items, renderItem, className = '' }: ListProps<T>) {
  return (
    <Component className={`my-6 ml-6 list-disc [&>li]:mt-2 ${className}`}>
      {items.map((item, index) => (
        <li key={index}>{renderItem ? renderItem(item, index) : item}</li>
      ))}
    </Component>
  );
}

// Generic Table component
interface Column<T> {
  key: keyof T;
  label: string;
  align?: 'left' | 'center' | 'right';
  renderCell?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  className?: string;
}

export function Table<T>({ columns, data, className = '' }: TableProps<T>) {
  return (
    <div className={`my-6 w-full overflow-x-auto ${className}`}>
      <table className="w-full">
        <thead>
          <tr className="even:bg-muted border-t">
            {columns.map(({ label, align }, index) => (
              <th
                key={index}
                align={align}
                className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right"
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="even:bg-muted border-t">
              {columns.map(({ key, align, renderCell }, colIndex) => (
                <td
                  key={colIndex}
                  align={align}
                  className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"
                >
                  {renderCell ? renderCell(row) : row[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
