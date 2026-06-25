import { useEffect, useState, useCallback, useRef } from 'react';
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Chip,
  Paper,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PageHeader from '../../components/PageHeader';
import { api } from '../../api/client';
import type { TeacherSubject, JournalData, AttendanceStatus } from '../../types';

export default function TeacherJournalPage() {
  const [subjects, setSubjects] = useState<TeacherSubject[]>([]);
  const [selectedId, setSelectedId] = useState<number | ''>('');
  const [journal, setJournal] = useState<JournalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [addDayOpen, setAddDayOpen] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [gradeDialog, setGradeDialog] = useState<{
    entryId: number;
    studentName: string;
    currentGrade: number | null;
  } | null>(null);
  const [gradeInput, setGradeInput] = useState('');
  const [hover, setHover] = useState<{ row: number | null; col: number | null }>({
    row: null,
    col: null,
  });
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.get<TeacherSubject[]>('/journal/teacher-subjects').then((r) => {
      setSubjects(r.data);
      if (r.data.length) setSelectedId(r.data[0].id);
      setLoading(false);
    });
  }, []);

  const loadJournal = useCallback(() => {
    if (!selectedId) return;
    api.get<JournalData>(`/journal/${selectedId}`).then((r) => setJournal(r.data));
  }, [selectedId]);

  useEffect(() => {
    loadJournal();
  }, [loadJournal]);

  const updateEntry = async (
    entryId: number,
    data: { attendance?: AttendanceStatus; grade?: number | null; lateMinutes?: number | null },
  ) => {
    await api.patch(`/journal/entries/${entryId}`, data);
    loadJournal();
  };

  const handleAddDay = async () => {
    if (!selectedId || !newDate) return;
    await api.post(`/journal/${selectedId}/days`, { date: newDate });
    setAddDayOpen(false);
    setNewDate('');
    loadJournal();
  };

  const handleCellClick = (
    e: React.MouseEvent,
    entryId: number,
    studentName: string,
    currentGrade: number | null,
    currentAttendance: AttendanceStatus,
  ) => {
    e.preventDefault();
    if (e.button === 2) {
      updateEntry(entryId, {
        attendance: currentAttendance === 'ABSENT' ? 'PRESENT' : 'ABSENT',
        grade: currentAttendance === 'ABSENT' ? currentGrade : null,
      });
    } else if (e.button === 1) {
      updateEntry(entryId, {
        attendance: currentAttendance === 'LATE' ? 'PRESENT' : 'LATE',
        lateMinutes: currentAttendance === 'LATE' ? null : 15,
      });
    } else if (e.button === 0) {
      setGradeDialog({ entryId, studentName, currentGrade });
      setGradeInput(currentGrade?.toString() ?? '');
    }
  };

  const handleGradeSubmit = async () => {
    if (!gradeDialog) return;
    const val = gradeInput.trim();
    if (val && !/^[2-5]$/.test(val)) return;
    await updateEntry(gradeDialog.entryId, {
      grade: val ? parseInt(val) : null,
    });
    setGradeDialog(null);
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!gradeDialog) return;
      if (/^[2-5]$/.test(e.key)) {
        setGradeInput(e.key);
        updateEntry(gradeDialog.entryId, { grade: parseInt(e.key) });
        setGradeDialog(null);
      } else if (e.key === 'Escape') {
        setGradeDialog(null);
      }
    },
    [gradeDialog, updateEntry],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Журнал"
        subtitle={
          journal
            ? `${journal.teacherSubject.subject.name} — ${journal.teacherSubject.group.name}`
            : 'Выберите предмет и группу'
        }
        action={
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 220 }}>
              <InputLabel>Предмет / Группа</InputLabel>
              <Select
                value={selectedId}
                label="Предмет / Группа"
                onChange={(e) => setSelectedId(e.target.value as number)}
              >
                {subjects.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.subject.name} — {s.group.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddDayOpen(true)}>
              Добавить день
            </Button>
          </Box>
        }
      />

      <Alert severity="info" sx={{ mb: 2 }}>
        ЛКМ — оценка · СКМ — опоздание · ПКМ — отсутствие · Клавиши 2–5 — быстрая оценка
      </Alert>

      {journal && (
        <Paper sx={{ overflow: 'auto' }} ref={tableRef}>
          <Box
            component="table"
            sx={{
              borderCollapse: 'collapse',
              width: '100%',
              minWidth: 600,
              '& th, & td': {
                border: '1px solid',
                borderColor: 'divider',
                p: 0,
                textAlign: 'center',
                fontSize: '0.875rem',
              },
              '& th': {
                bgcolor: 'grey.100',
                fontWeight: 600,
                p: 1,
                position: 'sticky',
                top: 0,
                zIndex: 2,
              },
            }}
            onContextMenu={(e) => e.preventDefault()}
          >
            <thead>
              <tr>
                <th style={{ minWidth: 180, textAlign: 'left', paddingLeft: 12, position: 'sticky', left: 0, zIndex: 3, background: '#f5f5f5' }}>
                  Студент
                </th>
                {journal.days.map((day, colIdx) => (
                  <th
                    key={day.id}
                    style={{
                      background: hover.col === colIdx ? '#dbeafe' : '#f5f5f5',
                      minWidth: 70,
                    }}
                  >
                    {formatDate(day.date)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {journal.students.map((student, rowIdx) => {
                const isExpelled = student.status === 'EXPELLED';
                const isNew = student.status === 'NEW';
                return (
                  <tr
                    key={student.id}
                    style={{
                      opacity: isExpelled ? 0.45 : 1,
                      background: hover.row === rowIdx ? '#eff6ff' : isNew ? '#fef9c3' : 'transparent',
                    }}
                  >
                    <td
                      style={{
                        textAlign: 'left',
                        padding: '8px 12px',
                        fontWeight: 500,
                        position: 'sticky',
                        left: 0,
                        background: hover.row === rowIdx ? '#eff6ff' : isNew ? '#fef9c3' : '#fff',
                        zIndex: 1,
                      }}
                    >
                      {student.lastName} {student.firstName}
                      {isNew && (
                        <Chip label="новый" size="small" color="warning" sx={{ ml: 1, height: 20, fontSize: '0.65rem' }} />
                      )}
                    </td>
                    {journal.days.map((day, colIdx) => {
                      const entry = day.entries.find((e) => e.studentId === student.id);
                      if (!entry) return <td key={day.id}>-</td>;
                      const bg = getCellBg(entry.attendance, entry.grade);
                      const isHovered = hover.row === rowIdx || hover.col === colIdx;
                      return (
                        <td
                          key={day.id}
                          onMouseEnter={() => setHover({ row: rowIdx, col: colIdx })}
                          onMouseLeave={() => setHover({ row: null, col: null })}
                          onMouseDown={(e) =>
                            handleCellClick(
                              e,
                              entry.id,
                              `${student.lastName} ${student.firstName}`,
                              entry.grade,
                              entry.attendance,
                            )
                          }
                          style={{
                            cursor: 'pointer',
                            background: isHovered ? '#bfdbfe' : bg,
                            color: entry.attendance === 'ABSENT' ? '#9ca3af' : 'inherit',
                            userSelect: 'none',
                            padding: '10px 4px',
                            fontWeight: entry.grade ? 700 : 400,
                          }}
                        >
                          {entry.attendance === 'ABSENT'
                            ? 'н'
                            : entry.attendance === 'LATE'
                              ? entry.grade
                                ? `${entry.grade}*`
                                : 'оп'
                              : entry.grade ?? '·'}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </Box>
        </Paper>
      )}

      <Dialog open={addDayOpen} onClose={() => setAddDayOpen(false)}>
        <DialogTitle>Добавить день в журнал</DialogTitle>
        <DialogContent>
          <TextField
            type="date"
            label="Дата"
            fullWidth
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDayOpen(false)}>Отмена</Button>
          <Button variant="contained" onClick={handleAddDay}>
            Добавить
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!gradeDialog} onClose={() => setGradeDialog(null)}>
        <DialogTitle>Оценка — {gradeDialog?.studentName}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Оценка (2-5)"
            value={gradeInput}
            onChange={(e) => {
              const v = e.target.value;
              if (v === '' || /^[2-5]$/.test(v)) setGradeInput(v);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleGradeSubmit();
            }}
            slotProps={{ htmlInput: { maxLength: 1 } }}
            helperText="Введите цифру от 2 до 5 или оставьте пустым"
            fullWidth
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGradeDialog(null)}>Отмена</Button>
          <Button variant="contained" onClick={handleGradeSubmit}>
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function formatDate(date: string) {
  const d = new Date(date);
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}

function getCellBg(attendance: AttendanceStatus, grade: number | null) {
  if (attendance === 'ABSENT') return '#f3f4f6';
  if (attendance === 'LATE') return '#fef3c7';
  if (grade === 5) return '#dcfce7';
  if (grade === 4) return '#dbeafe';
  if (grade === 3) return '#fef9c3';
  if (grade === 2) return '#fee2e2';
  return '#fff';
}
