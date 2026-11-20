<?php

namespace App\Imports;

use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Cache;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithUpsertColumns;
use Maatwebsite\Excel\Concerns\WithUpserts;
use Maatwebsite\Excel\Events\AfterChunk;
use Maatwebsite\Excel\Events\AfterImport;
use Maatwebsite\Excel\Events\BeforeImport;
use Maatwebsite\Excel\Events\ImportFailed;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class OrderImport implements ShouldQueue, ToModel, WithBatchInserts, WithChunkReading, WithEvents, WithHeadingRow, WithUpsertColumns, WithUpserts
{
    /** hashes already seen in this chunk (avoids "row affected twice" on upsert) */
    private array $seen = [];

    public function __construct(private string $importId) {}

    public function registerEvents(): array
    {
        return [
            BeforeImport::class => function (BeforeImport $event) {
                $rows = array_sum($event->getReader()->getTotalRows());
                $this->setMeta(['status' => 'processing', 'total' => max(0, $rows - 1)]); // minus heading row
            },
            AfterChunk::class => function () {
                Cache::increment("import:{$this->importId}:processed", $this->chunkSize());
            },
            AfterImport::class => function () {
                $this->setMeta(['status' => 'done']);
            },
            ImportFailed::class => function () {
                $this->setMeta(['status' => 'failed']);
            },
        ];
    }

    private function setMeta(array $changes): void
    {
        $key = "import:{$this->importId}";
        Cache::put($key, array_merge(Cache::get($key, []), $changes), 3600);
    }

    public function model(array $row): ?Order
    {
        $data = [
            'vbeln' => $this->str($row['vbeln'] ?? null),
            'pdate' => $this->date($row['pdate'] ?? null, 'Y-m-d'),
            'name' => $this->str($row['name'] ?? null),
            'addr1' => $this->str($row['addr1'] ?? null),
            'addr2' => $this->str($row['addr2'] ?? null),
            'city' => $this->str($row['city'] ?? null),
            'region' => $this->str($row['region'] ?? null),
            'tzone' => $this->str($row['tzone'] ?? null),
            'volum' => $this->num($row['volum'] ?? null),
        ];

        if ($data['tzone'] === null || ! str_starts_with($data['tzone'], 'L')) {
            return null;
        }

        if (! array_filter($data, fn ($v) => $v !== null)) {
            return null;
        }

        $hash = sha1(json_encode($data));
        if (isset($this->seen[$hash])) {
            return null;
        }
        $this->seen[$hash] = true;

        return new Order($data + [
            'plan_board' => $data['tzone'],
            'row_hash' => $hash,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function uniqueBy(): string
    {
        return 'row_hash';
    }

    public function upsertColumns(): array
    {
        return ['updated_at'];
    }

    public function batchSize(): int
    {
        return 500;
    }

    public function chunkSize(): int
    {
        return 500;
    }

    private function num(mixed $value): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }
        if (! is_numeric($value)) {
            return $this->str($value);
        }

        return number_format((float) $value, 3, '.', ''); // 1.5, "1.50", 1.5 all hash the same
    }

    private function str(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }

        // avoid 8.02131067E+8 for numeric cells
        if (is_float($value) && floor($value) == $value) {
            $value = (int) $value;
        }

        $value = trim((string) $value);

        return $value === '' ? null : $value;
    }

    private function date(mixed $value, string $format): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        // numeric cells can arrive as 20261104 or 20261104.0
        if (is_float($value) && floor($value) == $value) {
            $value = (int) $value;
        }

        $string = trim((string) $value);

        // expected format: yyyymmdd
        if (preg_match('/^\d{8}$/', $string)) {
            try {
                return Carbon::createFromFormat('Ymd', $string)->format($format);
            } catch (\Throwable) {
                return null;
            }
        }

        // fallback: a real Excel date-formatted cell (serial like 46330)
        if (is_numeric($value) && $value > 0 && $value < 100000) {
            return Date::excelToDateTimeObject($value)->format($format);
        }

        return null;
    }
}
