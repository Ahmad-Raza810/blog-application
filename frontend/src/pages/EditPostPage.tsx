import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService, PostStatus, extractValidationErrors, extractErrorMessage } from '../services/apiService';
import { Button, Input, Card, CardBody, Select, SelectItem, Chip, Switch } from '@nextui-org/react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Save, ArrowLeft, Image as ImageIcon, Type, Sparkles, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeIn } from '../utils/animation-utils';

// Simple Menu Bar for Tiptap
const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 p-2 border-b border-default-200 bg-default-50 rounded-t-lg items-center">
      <Button size="sm" variant={editor.isActive('bold') ? "solid" : "light"} color={editor.isActive('bold') ? "primary" : "default"} isIconOnly onClick={() => editor.chain().focus().toggleBold().run()} className="font-bold min-w-8 w-8 h-8">B</Button>
      <Button size="sm" variant={editor.isActive('italic') ? "solid" : "light"} color={editor.isActive('italic') ? "primary" : "default"} isIconOnly onClick={() => editor.chain().focus().toggleItalic().run()} className="italic min-w-8 w-8 h-8">I</Button>
      <Button size="sm" variant={editor.isActive('strike') ? "solid" : "light"} color={editor.isActive('strike') ? "primary" : "default"} isIconOnly onClick={() => editor.chain().focus().toggleStrike().run()} className="line-through min-w-8 w-8 h-8">S</Button>
      <div className="w-px h-6 bg-default-300 mx-1 self-center" />
      <Button size="sm" variant={editor.isActive('heading', { level: 1 }) ? "solid" : "light"} color={editor.isActive('heading', { level: 1 }) ? "primary" : "default"} isIconOnly onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className="font-bold min-w-8 w-8 h-8">H1</Button>
      <Button size="sm" variant={editor.isActive('heading', { level: 2 }) ? "solid" : "light"} color={editor.isActive('heading', { level: 2 }) ? "primary" : "default"} isIconOnly onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className="font-bold min-w-8 w-8 h-8">H2</Button>
      <div className="w-px h-6 bg-default-300 mx-1 self-center" />
      <Button size="sm" variant={editor.isActive('bulletList') ? "solid" : "light"} color={editor.isActive('bulletList') ? "primary" : "default"} isIconOnly onClick={() => editor.chain().focus().toggleBulletList().run()} className="min-w-8 w-8 h-8">•</Button>
      <Button size="sm" variant={editor.isActive('orderedList') ? "solid" : "light"} color={editor.isActive('orderedList') ? "primary" : "default"} isIconOnly onClick={() => editor.chain().focus().toggleOrderedList().run()} className="min-w-8 w-8 h-8">1.</Button>
    </div>
  );
};

const EditPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // If id is "new", it's a creation page, otherwise editing
  const isEditing = id && id !== 'new';
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tags, setTags] = useState<Set<string>>(new Set([]));
  const [status, setStatus] = useState<PostStatus>(PostStatus.DRAFT);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [availableTags, setAvailableTags] = useState<{ id: string; name: string }[]>([]);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [existingCoverUrl, setExistingCoverUrl] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[300px] p-4',
      },
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, tgs] = await Promise.all([
          apiService.getCategories(),
          apiService.getTags()
        ]);
        setCategories(cats);
        setAvailableTags(tgs);

        if (isEditing && id) {
          const post = await apiService.getPost(id);
          setTitle(post.title);
          editor?.commands.setContent(post.content);
          setCategoryId(post.category.id);
          setTags(new Set(post.tags.map(t => t.id)));
          // setStatus(post.status);
        }
      } catch (error) {
        console.error('Failed to load data', error);
      }
    };
    fetchData();
  }, [id, isEditing]);

  // Sync editor content when it's initialized and we have post data
  useEffect(() => {
    if (editor && !editor.getText() && isEditing && id) {
      apiService.getPost(id).then(post => {
        editor.commands.setContent(post.content);
        // Also set other fields if not already set strictly by the Promise.all
        setTitle(post.title);
        setCategoryId(post.category.id);
        setTags(new Set(post.tags.map(t => t.id)));
        setExistingCoverUrl(post.coverImageUrl || null);
      });
    }
  }, [editor, isEditing, id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };


  const [errors, setErrors] = useState<{ title?: string; categoryId?: string; content?: string }>({});

  const validateForm = () => {
    const newErrors: { title?: string; categoryId?: string; content?: string } = {};
    let isValid = true;

    // Title Validation
    if (!title.trim()) {
      newErrors.title = 'Title is required.';
      isValid = false;
    } else if (title.length < 10 || title.length > 200) {
      newErrors.title = 'Length of title should be in between 10 and 200';
      isValid = false;
    } else if (!/^[\w\s\-\.\p{So}]+$/u.test(title)) {
      newErrors.title = 'Title can include letters, numbers, spaces, hyphens, underscores, full stops, and emojis.';
      isValid = false;
    }

    // Category Validation
    if (!categoryId) {
      newErrors.categoryId = 'Category ID is required';
      isValid = false;
    }

    // Content Validation
    const contentText = editor?.getText() || '';
    if (!contentText.trim()) {
      newErrors.content = 'Content is required.';
      isValid = false;
    } else if (contentText.length < 20 || contentText.length > 2000) {
      newErrors.content = 'Length of content should be in between 20 and 2000';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!editor) return;

    if (!validateForm()) {
      return;
    }

    // Reset errors before submission
    setErrors({});
    setLoading(true);
    const content = editor.getHTML();

    try {
      const postData = {
        title,
        content,
        categoryId,
        tagIds: Array.from(tags),
        status
      };

      if (isEditing && id) {
        await apiService.updatePost({ ...postData, id }, selectedFile || undefined);
      } else {
        await apiService.createPost(postData, selectedFile || undefined);
      }
      navigate('/');
    } catch (error: any) {
      console.error('Failed to save post', error);

      // Extract validation errors from backend response
      const validationErrors = extractValidationErrors(error);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors as any);
      }

      // Show global error message if available
      const message = extractErrorMessage(error, 'Failed to save post');
      if (message && Object.keys(validationErrors).length === 0) {
        alert(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={fadeIn}
      className="max-w-6xl mx-auto px-4 py-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 sticky top-20 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-default-200">
        <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4 md:mb-0">
          {isEditing ? <><Type className="text-primary" /> Edit Post</> : <><Sparkles className="text-primary" /> Create New Post</>}
        </h1>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="light" startContent={<ArrowLeft size={18} />} onClick={() => navigate(-1)} className="flex-1 md:flex-none">
            Cancel
          </Button>
          <Button
            color="primary"
            isLoading={loading}
            startContent={!loading && <Save size={18} />}
            onPress={handleSubmit}
            className="font-medium shadow-lg shadow-primary/30 flex-1 md:flex-none"
          >
            {isEditing ? 'Update Post' : 'Publish Post'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Editor Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-panel border-default-200 shadow-sm">
            <CardBody className="p-0">
              <Input
                size="lg"
                variant="flat"
                placeholder="Post Title"
                value={title}
                onValueChange={(val) => {
                  setTitle(val);
                  if (errors.title) setErrors({ ...errors, title: undefined });
                }}
                isInvalid={!!errors.title}
                errorMessage={errors.title}
                classNames={{
                  input: "text-3xl font-display font-bold",
                  inputWrapper: "bg-transparent shadow-none border-b border-default-100 rounded-none h-auto py-6 px-6"
                }}
              />
              <MenuBar editor={editor} />
              <EditorContent editor={editor} className="min-h-[500px]" />
              {errors.content && (
                <div className="px-6 pb-4 text-sm text-danger">{errors.content}</div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <Card className="glass-panel border-default-200 shadow-sm p-4">
            <h3 className="font-semibold mb-4 text-default-500 text-sm uppercase tracking-wider">Publishing</h3>
            <div className="flex flex-col gap-6">
              <Select
                label="Category"
                placeholder="Select a category"
                selectedKeys={categoryId ? [categoryId] : []}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  if (errors.categoryId) setErrors({ ...errors, categoryId: undefined });
                }}
                variant="bordered"
                isInvalid={!!errors.categoryId}
                errorMessage={errors.categoryId}
              >
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </Select>

              <Select
                label="Tags"
                placeholder="Select tags"
                selectionMode="multiple"
                selectedKeys={tags}
                onSelectionChange={(keys) => setTags(keys as Set<string>)}
                variant="bordered"
                renderValue={(items) => (
                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <Chip key={item.key} size="sm">{item.textValue}</Chip>
                    ))}
                  </div>
                )}
              >
                {availableTags.map((tag) => (
                  <SelectItem key={tag.id} textValue={tag.name}>
                    {tag.name}
                  </SelectItem>
                ))}
              </Select>

              <Select
                label="Status"
                selectedKeys={[status]}
                onChange={(e) => setStatus(e.target.value as PostStatus)}
                variant="bordered"
                disallowEmptySelection
              >
                <SelectItem key={PostStatus.DRAFT} value={PostStatus.DRAFT}>
                  Draft
                </SelectItem>
                <SelectItem key={PostStatus.PUBLISHED} value={PostStatus.PUBLISHED}>
                  Published
                </SelectItem>
              </Select>
            </div>
          </Card>

          <Card className="glass-panel border-default-200 shadow-sm p-4">
            <h3 className="font-semibold mb-4 text-default-500 text-sm uppercase tracking-wider">Cover Image</h3>
            <div className="flex flex-col gap-4">
              <input
                type="file"
                id="cover-upload"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              {(previewUrl || existingCoverUrl) ? (
                <div className="relative rounded-xl overflow-hidden border border-default-200 aspect-video group">
                  <img
                    src={previewUrl || existingCoverUrl || ''}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      as="label"
                      htmlFor="cover-upload"
                      size="sm"
                      variant="flat"
                      className="text-white bg-white/20 backdrop-blur-md"
                    >
                      Change
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      color="danger"
                      variant="flat"
                      onPress={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                        setExistingCoverUrl(null);
                      }}
                      className="bg-white/20 backdrop-blur-md text-white"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="cover-upload"
                  className="border-2 border-dashed border-default-300 rounded-xl h-40 flex flex-col items-center justify-center text-default-400 hover:bg-default-50 transition-colors cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-full bg-default-100 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <ImageIcon size={24} />
                  </div>
                  <span className="text-xs font-medium">Click to upload or drag & drop</span>
                </label>
              )}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default EditPostPage;