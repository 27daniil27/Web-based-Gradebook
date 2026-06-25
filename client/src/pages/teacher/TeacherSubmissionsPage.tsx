import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import GradeIcon from '@mui/icons-material/Grade';
import { api, FILE_BASE } from '../../api/client';
import type { TeacherSubject } from '../../types';

interface SubmissionItem {
  id: number;
  title: string;
  deadline: string | null;
  submissions: {
    id: number;
    student: { id: number; name: string } | null;
    team: string | null;
    filePath: string | null;
    originalFileName: string | null;
    submittedAt: string | null;
    grade: number | null;
    teacherComment: string | null;
    status: string;
  }[];
}

export default function TeacherSubmissionsPage() {
  const [subjects, setSubjects] = useState<TeacherSubject[]>([]);
  const [selectedId, setSelectedId] = useState<number | ''>('');
  const [labs, setLabs] = useState<SubmissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [gradeDialog, setGradeDialog] = useState<{
    id: number;
    name: string;
    grade: number | null;
    comment: string | null;
  } | null>(null);
  const [grade, setGrade] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    api.get<TeacherSubject[]>('/journal/teacher-subjects').then((r) => {
      setSubjects(r.data);
      if (r.data.length) setSelectedId(r.data[0].id);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    api.get<SubmissionItem[]>(`/program/submissions/${selectedId}`).then((r) => setLabs(r.data));
  }, [selectedId]);

  const handleGrade = async () => {
    if (!gradeDialog) return;
    await api.patch(`/program/submissions/${gradeDialog.id}/grade`, {
      grade: grade ? parseInt(grade) : undefined,
      teacherComment: comment || undefined,
    });
    setGradeDialog(null);
    if (selectedId) {
      api.get<SubmissionItem[]>(`/program/submissions/${selectedId}`).then((r) => setLabs(r.data));
    }
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
        <Typography variant="h4">Сдача лабораторных</Typography>
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
      </Box>

      {labs.map((lab) => (
        <Card key={lab.id} sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">{lab.title}</Typography>
              {lab.deadline && (
                <Chip label={`Дедлайн: ${new Date(lab.deadline).toLocaleDateString('ru-RU')}`} size="small" />
              )}
            </Box>

            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Студент / Команда</TableCell>
                    <TableCell>Дата сдачи</TableCell>
                    <TableCell>Файл</TableCell>
                    <TableCell>Статус</TableCell>
                    <TableCell>Оценка</TableCell>
                    <TableCell align="right">Действия</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lab.submissions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        Нет сданных работ
                      </TableCell>
                    </TableRow>
                  ) : (
                    lab.submissions.map((sub) => (
                      <TableRow key={sub.id}>
                        <TableCell>{sub.student?.name ?? sub.team}</TableCell>
                        <TableCell>
                          {sub.submittedAt
                            ? new Date(sub.submittedAt).toLocaleDateString('ru-RU')
                            : '—'}
                        </TableCell>
                        <TableCell>
                          {sub.filePath ? (
                            <Button
                              size="small"
                              startIcon={<DownloadIcon />}
                              href={`${FILE_BASE}${sub.filePath}`}
                              target="_blank"
                            >
                              {sub.originalFileName}
                            </Button>
                          ) : (
                            '—'
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={sub.status === 'GRADED' ? 'Проверено' : 'На проверке'}
                            size="small"
                            color={sub.status === 'GRADED' ? 'success' : 'warning'}
                          />
                        </TableCell>
                        <TableCell>{sub.grade ?? '—'}</TableCell>
                        <TableCell align="right">
                          <Button
                            size="small"
                            startIcon={<GradeIcon />}
                            onClick={() => {
                              setGradeDialog({
                                id: sub.id,
                                name: sub.student?.name ?? sub.team ?? '',
                                grade: sub.grade,
                                comment: sub.teacherComment,
                              });
                              setGrade(sub.grade?.toString() ?? '');
                              setComment(sub.teacherComment ?? '');
                            }}
                          >
                            Проверить
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      ))}

      <Dialog open={!!gradeDialog} onClose={() => setGradeDialog(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Проверка — {gradeDialog?.name}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Оценка (2-5)"
            value={grade}
            onChange={(e) => {
              const v = e.target.value;
              if (v === '' || /^[2-5]$/.test(v)) setGrade(v);
            }}
            sx={{ mt: 1, mb: 2 }}
            slotProps={{ htmlInput: { maxLength: 1 } }}
          />
          <TextField
            fullWidth
            label="Комментарий"
            multiline
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGradeDialog(null)}>Отмена</Button>
          <Button variant="contained" onClick={handleGrade}>
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
