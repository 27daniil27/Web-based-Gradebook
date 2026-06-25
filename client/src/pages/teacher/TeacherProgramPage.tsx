import { useEffect, useState, useRef } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { api } from '../../api/client';
import type { TeacherSubject, ProgramItem, ProgramItemType } from '../../types';

const TYPES: { value: ProgramItemType; label: string }[] = [
  { value: 'LAB', label: 'Лабораторная' },
  { value: 'THEORY', label: 'Теория' },
  { value: 'PRACTICE', label: 'Практика' },
  { value: 'TEST', label: 'Контрольная' },
  { value: 'ORAL', label: 'Устный опрос' },
];

export default function TeacherProgramPage() {
  const [subjects, setSubjects] = useState<TeacherSubject[]>([]);
  const [selectedId, setSelectedId] = useState<number | ''>('');
  const [items, setItems] = useState<ProgramItem[]>([]);
  const [students, setStudents] = useState<{ id: number; firstName: string; lastName: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [teamOpen, setTeamOpen] = useState<ProgramItem | null>(null);
  const [form, setForm] = useState({
    type: 'LAB' as ProgramItemType,
    title: '',
    description: '',
    deadline: '',
    theoryMaterials: '',
    isTeamWork: false,
  });
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const fileRefs = useRef<Record<number, HTMLInputElement | null>>({});

  useEffect(() => {
    api.get<TeacherSubject[]>('/journal/teacher-subjects').then((r) => {
      setSubjects(r.data);
      if (r.data.length) setSelectedId(r.data[0].id);
      setLoading(false);
    });
  }, []);

  const load = () => {
    if (!selectedId) return;
    api.get<ProgramItem[]>(`/program/${selectedId}`).then((r) => setItems(r.data));
    api.get<{ students: { id: number; firstName: string; lastName: string }[] }>(`/journal/${selectedId}`).then((r) =>
      setStudents(r.data.students),
    );
  };

  useEffect(() => {
    load();
  }, [selectedId]);

  const handleCreate = async () => {
    if (!selectedId) return;
    await api.post(`/program/${selectedId}/items`, form);
    setCreateOpen(false);
    setForm({ type: 'LAB', title: '', description: '', deadline: '', theoryMaterials: '', isTeamWork: false });
    load();
  };

  const handleUpload = async (itemId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    await api.post(`/program/items/${itemId}/assignment`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    load();
  };

  const handleCreateTeam = async () => {
    if (!teamOpen) return;
    await api.post(`/program/items/${teamOpen.id}/teams`, { studentIds: selectedStudents });
    setTeamOpen(null);
    setSelectedStudents([]);
    load();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4">Программа по предмету</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel>Предмет / Группа</InputLabel>
            <Select value={selectedId} label="Предмет / Группа" onChange={(e) => setSelectedId(e.target.value as number)}>
              {subjects.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.subject.name} — {s.group.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
            Добавить занятие
          </Button>
        </Box>
      </Box>

      {items.map((item) => (
        <Card key={item.id} sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <Chip label={TYPES.find((t) => t.value === item.type)?.label} size="small" color="primary" variant="outlined" />
                  {item.isTeamWork && <Chip label="Команда" size="small" color="secondary" />}
                  {item.deadline && (
                    <Chip label={`Дедлайн: ${new Date(item.deadline).toLocaleDateString('ru-RU')}`} size="small" />
                  )}
                </Box>
                <Typography variant="h6">{item.title}</Typography>
                {item.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {item.description}
                  </Typography>
                )}
                {item.teams && item.teams.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    {item.teams.map((t) => (
                      <Chip
                        key={t.id}
                        label={`${t.name}: ${t.members.map((m) => m.name).join(', ')}`}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </Box>
                )}
              </Box>
              <Box>
                {item.type === 'LAB' && item.isTeamWork && (
                  <IconButton onClick={() => setTeamOpen(item)} title="Настроить команду">
                    <GroupAddIcon />
                  </IconButton>
                )}
                <IconButton onClick={() => fileRefs.current[item.id]?.click()} title="Загрузить ТЗ">
                  <UploadFileIcon />
                </IconButton>
                <input
                  ref={(el) => { fileRefs.current[item.id] = el; }}
                  type="file"
                  hidden
                  onChange={(e) => e.target.files?.[0] && handleUpload(item.id, e.target.files[0])}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Добавить занятие</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 1, mb: 2 }}>
            <InputLabel>Тип</InputLabel>
            <Select
              value={form.type}
              label="Тип"
              onChange={(e) => setForm({ ...form, type: e.target.value as ProgramItemType })}
            >
              {TYPES.map((t) => (
                <MenuItem key={t.value} value={t.value}>
                  {t.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField fullWidth label="Название" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} sx={{ mb: 2 }} />
          <TextField fullWidth label="Описание" multiline rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} sx={{ mb: 2 }} />
          <TextField fullWidth type="date" label="Дедлайн" slotProps={{ inputLabel: { shrink: true } }} value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} sx={{ mb: 2 }} />
          <TextField fullWidth label="Теор. материалы (URL)" value={form.theoryMaterials} onChange={(e) => setForm({ ...form, theoryMaterials: e.target.value })} sx={{ mb: 2 }} />
          <FormControlLabel
            control={<Checkbox checked={form.isTeamWork} onChange={(e) => setForm({ ...form, isTeamWork: e.target.checked })} />}
            label="Командная работа"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Отмена</Button>
          <Button variant="contained" onClick={handleCreate} disabled={!form.title}>
            Создать
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!teamOpen} onClose={() => setTeamOpen(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Команда — {teamOpen?.title}</DialogTitle>
        <DialogContent>
          <List dense>
            {students.map((s) => (
              <ListItem key={s.id} disablePadding>
                <ListItemText primary={`${s.lastName} ${s.firstName}`} />
                <Checkbox
                  checked={selectedStudents.includes(s.id)}
                  onChange={(e) =>
                    setSelectedStudents(
                      e.target.checked
                        ? [...selectedStudents, s.id]
                        : selectedStudents.filter((id) => id !== s.id),
                    )
                  }
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTeamOpen(null)}>Отмена</Button>
          <Button variant="contained" onClick={handleCreateTeam} disabled={selectedStudents.length < 2}>
            Создать команду
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
