"use client";

import { RecordItem } from "@/types/record";

export default function RecordList({
  records,
}: {
  records: RecordItem[];
}) {
  if (records.length === 0) {
    return (
      <div className="text-gray-500">
        No records found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {records.map((record) => (
        <details
          key={record._id}
          className="rounded border p-4"
        >
          <summary className="cursor-pointer font-semibold">
            {record.title}
          </summary>

          <div className="mt-3 space-y-2 text-sm">
            {/* Structured data */}
            {Object.entries(record.data).map(
              ([key, value]) => (
                <div key={key}>
                  <strong>{key}:</strong>{" "}
                  {String(value)}
                </div>
              )
            )}

            {/* Documents */}
            {record.documents.length > 0 && (
              <div className="mt-3">
                <strong>Documents:</strong>
                <ul className="list-disc ml-5">
                  {record.documents.map((doc) => (
                    <li key={doc.fileName}>
                      <a
                        href={`/api/uploads/${doc.fileName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {doc.originalName}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}
