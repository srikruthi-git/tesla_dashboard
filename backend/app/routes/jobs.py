from typing import Any

from flask import Blueprint, jsonify, request

from ..db import execute, fetch_all, fetch_one

jobs_bp = Blueprint('jobs', __name__, url_prefix='/jobs')


@jobs_bp.get('')
def list_jobs():
    rows = fetch_all(
        """
        SELECT id, customer, installation_type, status, assigned_engineer, scheduled_date
        FROM jobs
        ORDER BY scheduled_date DESC
        """
    )
    return jsonify([serialize_job(row) for row in rows])


@jobs_bp.post('')
def create_job():
    payload = request.get_json(silent=True) or {}
    errors = validate_job_payload(payload)

    if errors:
        return jsonify({'errors': errors}), 400

    job_id = execute(
        """
        INSERT INTO jobs (customer, installation_type, status, assigned_engineer, scheduled_date)
        VALUES (?, ?, ?, ?, ?)
        """,
        (
            payload['customer'],
            payload['installation_type'],
            payload['status'],
            payload['assigned_engineer'],
            payload['scheduled_date']
        )
    )

    row = fetch_one(
        """
        SELECT id, customer, installation_type, status, assigned_engineer, scheduled_date
        FROM jobs
        WHERE id = ?
        """,
        (job_id,)
    )

    return jsonify(serialize_job(row)), 201


@jobs_bp.put('/<int:job_id>')
def update_job(job_id: int):
    payload = request.get_json(silent=True) or {}
    errors = validate_job_payload(payload)

    if errors:
        return jsonify({'errors': errors}), 400

    existing = fetch_one('SELECT id FROM jobs WHERE id = ?', (job_id,))
    if existing is None:
        return jsonify({'message': 'Job not found.'}), 404

    execute(
        """
        UPDATE jobs
        SET customer = ?, installation_type = ?, status = ?, assigned_engineer = ?, scheduled_date = ?
        WHERE id = ?
        """,
        (
            payload['customer'],
            payload['installation_type'],
            payload['status'],
            payload['assigned_engineer'],
            payload['scheduled_date'],
            job_id
        )
    )

    row = fetch_one(
        """
        SELECT id, customer, installation_type, status, assigned_engineer, scheduled_date
        FROM jobs
        WHERE id = ?
        """,
        (job_id,)
    )

    return jsonify(serialize_job(row))


@jobs_bp.delete('/<int:job_id>')
def delete_job(job_id: int):
    existing = fetch_one('SELECT id FROM jobs WHERE id = ?', (job_id,))
    if existing is None:
        return jsonify({'message': 'Job not found.'}), 404

    execute('DELETE FROM jobs WHERE id = ?', (job_id,))
    return jsonify({'message': 'Job deleted.'})


def serialize_job(row: Any) -> dict[str, Any]:
    return {
        'id': row['id'],
        'customer': row['customer'],
        'installation_type': row['installation_type'],
        'status': row['status'],
        'assigned_engineer': row['assigned_engineer'],
        'scheduled_date': row['scheduled_date']
    }


def validate_job_payload(payload: dict[str, Any]) -> list[str]:
    required_fields = [
        'customer',
        'installation_type',
        'status',
        'assigned_engineer',
        'scheduled_date'
    ]

    errors: list[str] = []

    for field in required_fields:
        value = payload.get(field)
        if not isinstance(value, str) or not value.strip():
            errors.append(f'{field} is required.')

    return errors
