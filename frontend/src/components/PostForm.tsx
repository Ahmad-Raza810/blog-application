import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { apiService, Category, Tag, Post } from '../services/apiService';
import { Input, Button, Select, SelectItem, Chip, Spinner } from '@nextui-org/react';
import { Save, X, Image as ImageIcon, Type, Hash, BookOpen } from 'lucide-react';

interface PostFormProps {
  postId?: string;
}

const PostForm: React.FC<PostFormProps> = ({ postId }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<Set<string>>(new Set([]));
  const [coverImage, setCoverImage] = useState('');

  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[300px] px-4 py-2',
      },
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, tagsData] = await Promise.all([
          apiService.getCategories(),
          apiService.getTags(),
        ]);
        setCategories(categoriesData);
        setTags(tagsData);

        if (postId) {
          const post = await apiService.getPost(postId);
          setTitle(post.title);
          setContent(post.content);
          setCategoryId(post.category.id);
          setSelectedTagIds(new Set(post.tags.map((t) => t.id)));
          setCoverImage(post.coverImage || ''); // Assuming API supports coverImage now or ignore if not
          editor?.commands.setContent(post.content);
        }
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchData();
  }, [postId, editor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const postData = {
        title,
        content,
        categoryId,
        tagIds: Array.from(selectedTagIds),
        coverImage,
      };

      if (postId) {
        await apiService.updatePost(postId, postData);
      } else {
        await apiService.createPost(postData);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      {error && (
        <div className="bg-danger-50 text-danger p-4 mb-6 rounded-lg border border-danger-100 mx-6 mt-6">
          {error}
        </div>
      )}

      <div className="p-6 md:p-8 space-y-6 border-b border-divider">
        <Input
          label="Post Title"
          placeholder="Enter an engaging title..."
          value={title}
          onValueChange={setTitle}
          variant="bordered"
          size="lg"
          classNames={{
            input: "text-2xl font-bold font-display",
            inputWrapper: "border-none shadow-none bg-transparent px-0 data-[hover=true]:bg-transparent group-data-[focus=true]:bg-transparent",
            label: "hidden"
          }}
          startContent={<Type size={24} className="text-default-300 mr-2" />}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Category"
            placeholder="Select a category"
            selectedKeys={categoryId ? [categoryId] : []}
            onChange={(e) => setCategoryId(e.target.value)}
            startContent={<BookOpen size={18} className="text-default-400" />}
            variant="bordered"
          >
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </Select>

          <Select
            label="Tags"
            placeholder="Select tags"
            selectionMode="multiple"
            selectedKeys={selectedTagIds}
            onSelectionChange={(keys) => setSelectedTagIds(keys as Set<string>)}
            startContent={<Hash size={18} className="text-default-400" />}
            variant="bordered"
            renderValue={(items) => {
              return (
                <div className="flex flex-wrap gap-2">
                  {items.map((item) => (
                    <Chip key={item.key} size="sm" variant="flat" color="primary">
                      {item.textValue}
                    </Chip>
                  ))}
                </div>
              );
            }}
          >
            {tags.map((tag) => (
              <SelectItem key={tag.id} value={tag.id}>
                {tag.name}
              </SelectItem>
            ))}
          </Select>
        </div>

        <Input
          label="Cover Image URL"
          placeholder="https://example.com/image.jpg"
          value={coverImage}
          onValueChange={setCoverImage}
          startContent={<ImageIcon size={18} className="text-default-400" />}
          variant="bordered"
        />
      </div>

      {/* Editor Toolbar could go here */}
      <div className="flex-grow bg-slate-50 dark:bg-slate-900/30 min-h-[400px]">
        <EditorContent editor={editor} className="h-full p-6 md:p-8" />
      </div>

      <div className="p-6 border-t border-divider flex justify-end gap-3 bg-white dark:bg-slate-900 rounded-b-2xl">
        <Button
          variant="flat"
          color="danger"
          startContent={<X size={18} />}
          onPress={() => navigate('/')}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-gradient-primary text-white shadow-lg font-semibold"
          isLoading={loading}
          startContent={!loading && <Save size={18} />}
        >
          {postId ? 'Update Post' : 'Publish Post'}
        </Button>
      </div>
    </form>
  );
};

export default PostForm;