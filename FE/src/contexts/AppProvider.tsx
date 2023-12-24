import { ReactNode, createContext, useState, Dispatch, SetStateAction } from 'react';

interface CategoryData {
    key: number;
    id: number;
    // name: string;
    task: string;
    priority: string;
    due: string;
}

interface ContextProps {
    categories: CategoryData[];
    setCategories: Dispatch<SetStateAction<CategoryData[]>>;
}

interface Props {
    children: ReactNode;
}

const defaultValue: ContextProps = {
    categories: [],
    setCategories: () => { },
};

export const AppContext = createContext<ContextProps>(defaultValue);

const AppProvider = ({ children }: Props) => {
    const [categories, setCategories] = useState<CategoryData[]>([]);

    return (
        <AppContext.Provider value={{ categories, setCategories }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppProvider;
