'use client';

import useGetBlogs from '@/hooks/api/blog/useGetBlogs';
import { appConfig } from '@/utils/config';
import { useState } from 'react';
import Asyncselect from 'react-select/async';
import { debounce } from 'lodash';
import { useRouter } from 'next/navigation';

interface BlogOption {
  value: number;
  label: string;
}

const Autocomplete = () => {
  const router = useRouter();
  const [search, setSearch] = useState<string>('');

  const { data, isLoading } = useGetBlogs({ search });

  const loadOptions = (
    inputValue: string,
    callback: (options: BlogOption[]) => void,
  ) => {
    try {
      const options = data.map((blog) => {
        return {
          label: blog.title,
          value: blog.id,
        };
      });
      callback(options);
      setSearch(inputValue)
    } catch (error) {
      callback([]);
    }
  };

  const debouncedLoadOptions = debounce(loadOptions, 750);

  return (
    <Asyncselect
      placeholder="Search for articles"
      className="mx-auto my-4 max-w-[650px]"
      loadOptions={debouncedLoadOptions}
      isLoading={isLoading}
      onChange={(blog) => {
        router.push(appConfig.baseUrlNext + `/${blog?.value}`);
      }}
    />
  );
};

export default Autocomplete;
