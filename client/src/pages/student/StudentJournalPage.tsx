import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  CircularProgress,
  Chip,
  Paper,
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PageHeader from '../../components/PageHeader';
import { api } from '../../api/client';
import type { AttendanceStatus } from '../../types';

interface StudentJournalItem {
  teacherSubjectId: number;
  subject: { id: number; name: string };
  teacher: string;
  entries: {
    date: string;
    attendance: AttendanceStatus;
    grade: number | null;
    lateMinutes: number | null;
  }[];
}

export default function StudentJournalPage() {
  const [items, setItems] = useState<StudentJournalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get<StudentJournalItem[]>('/journal/my').then((r) => {
      setItems(r.data);
      setLoading(false);
    });
  }, []);

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
        title="Электронный журнал"
        subtitle="Пропуски и оценки по предметам"
      />

      {items.map((item) => {
        const absences = item.entries.filter((e) => e.attendance === 'ABSENT').length;
        const lates = item.entries.filter((e) => e.attendance === 'LATE').length;
        const avgGrade =
          item.entries.filter((e) => e.grade).reduce((s, e) => s + (e.grade ?? 0), 0) /
            (item.entries.filter((e) => e.grade).length || 1);

        return (
          <Card key={item.teacherSubjectId} sx={{ mb: 3 }}>
            <CardActionArea onClick={() => navigate(`/subject/${item.teacherSubjectId}`)}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box>
                    <Typography variant="h6">{item.subject.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.teacher}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    {absences > 0 && <Chip label={`Пропусков: ${absences}`} color="error" size="small" />}
                    {lates > 0 && <Chip label={`Опозданий: ${lates}`} color="warning" size="small" />}
                    <Chip label={`Ср. балл: ${avgGrade.toFixed(1)}`} color="primary" size="small" />
                    <ChevronRightIcon color="action" />
                  </Box>
                </Box>

                <Paper sx={{ overflow: 'auto' }}>
                  <Box
                    component="table"
                    sx={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      '& th, & td': { border: '1px solid', borderColor: 'divider', p: 1, fontSize: '0.8rem', textAlign: 'center' },
                      '& th': { bgcolor: 'grey.50', fontWeight: 600 },
                    }}
                  >
                    <thead>
                      <tr>
                        {item.entries.map((e) => (
                          <th key={e.date}>{formatDate(e.date)}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {item.entries.map((e) => (
                          <td
                            key={e.date}
                            style={{
                              background:
                                e.attendance === 'ABSENT'
                                  ? '#fee2e2'
                                  : e.attendance === 'LATE'
                                    ? '#fef3c7'
                                    : e.grade === 5
                                      ? '#dcfce7'
                                      : 'transparent',
                            }}
                          >
                            {e.attendance === 'ABSENT'
                              ? 'н'
                              : e.attendance === 'LATE'
                                ? e.grade
                                  ? `${e.grade}*`
                                  : 'оп'
                                : e.grade ?? '·'}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </Box>
                </Paper>
              </CardContent>
            </CardActionArea>
          </Card>
        );
      })}
    </Box>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}
