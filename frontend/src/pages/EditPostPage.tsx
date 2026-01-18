import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService, PostStatus } from '../services/apiService';
import { Button, Input, Card, CardBody, Select, SelectItem, Chip, Switch } from '@nextui-org/react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Save, ArrowLeft, Image as ImageIcon, Type, Sparkles } from 'lucide-react';
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
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);


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

  const handleCoverPick = (file: File | null) => {
    setCoverFile(file);

    if (coverPreview) {
      URL.revokeObjectURL(coverPreview);
    }

    if (file) {
      setCoverPreview(URL.createObjectURL(file));
    } else {
      setCoverPreview(null);
    }
  };

  useEffect(() => {
    return () => {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    };
  }, [coverPreview]);



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
          if (post.coverImage) {
            setCoverPreview(post.coverImage);
            setCoverFile(null); 
          }
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
      });
    }
  }, [editor, isEditing, id]);


  const handleSubmit = async () => {
  if (!editor) return;

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

    const payload = isEditing && id ? { ...postData, id } : postData;

    const formData = new FormData();
    formData.append("data", JSON.stringify(payload)); // ✅ STRING (da se vidi u View decoded)

    if (coverFile) {
      formData.append("coverImage", coverFile);
    }

    if (isEditing && id) {
      await apiService.updatePost(formData);
    } else {
      await apiService.createPost(formData);
    }

    navigate('/');
  } catch (error) {
    console.error('Failed to save post', error);
    alert('Failed to save post');
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
                onValueChange={setTitle}
                classNames={{
                  input: "text-3xl font-display font-bold",
                  inputWrapper: "bg-transparent shadow-none border-b border-default-100 rounded-none h-auto py-6 px-6"
                }}
              />
              <MenuBar editor={editor} />
              <EditorContent editor={editor} className="min-h-[500px]" />
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
                onChange={(e) => setCategoryId(e.target.value)}
                variant="bordered"
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

              <div className="flex items-center justify-between py-2 px-1">
                <span className="text-sm font-medium">Publish Immediately</span>
                <Switch
                  isSelected={status === PostStatus.PUBLISHED}
                  onValueChange={(val) => setStatus(val ? PostStatus.PUBLISHED : PostStatus.DRAFT)}
                  size="sm"
                />
              </div>
            </div>
          </Card>

          <Card className="glass-panel border-default-200 shadow-sm p-4">
            <h3 className="font-semibold mb-4 text-default-500 text-sm uppercase tracking-wider">Cover Image</h3>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => handleCoverPick(e.target.files?.[0] ?? null)}
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-default-300 rounded-xl h-40 flex flex-col items-center justify-center text-default-400 hover:bg-default-50 transition-colors cursor-pointer group overflow-hidden"
            >
              {coverPreview ? (
                <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-default-100 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <ImageIcon size={24} />
                  </div>
                  <span className="text-xs font-medium">Click to upload</span>
                </>
              )}
            </div>

            {coverFile && (
              <div className="mt-2 text-xs text-default-500 truncate">
                Selected: {coverFile.name}
              </div>
            )}
          </Card>

        </div>
      </div>
    </motion.div>
  );
};

export default EditPostPage;