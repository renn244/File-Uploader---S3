provider "aws" {
    region = "ap-southeast-1"

    access_key = "test"
    secret_key = "test"

    s3_use_path_style           = true
    skip_credentials_validation = true
    skip_metadata_api_check     = true
    skip_requesting_account_id = true

    endpoints {
        s3 = "http://localhost.localstack.cloud:4566"
        lambda  = "http://localhost.localstack.cloud:4566"
        iam     = "http://localhost.localstack.cloud:4566"
    }
}

resource "aws_s3_bucket" "my_bucket" {
    bucket = "file-uploader-bucket"
}

resource "aws_s3_bucket_public_access_block" "my_bucket_pab"{
    bucket = aws_s3_bucket.my_bucket.id

    block_public_acls = true
    block_public_policy = true
    ignore_public_acls = true
    restrict_public_buckets = true
}

resource "aws_s3_bucket_ownership_controls" "my_bucket_ownership" {
    bucket = aws_s3_bucket.my_bucket.id

    rule {
        object_ownership = "BucketOwnerEnforced"
    }
}

resource "aws_s3_bucket_cors_configuration" "my_bucket_cors" {
    bucket = aws_s3_bucket.my_bucket.id

    cors_rule {
        allowed_headers = ["*"]
        allowed_methods = ["GET", "PUT"]
        allowed_origins = ["*"]
        expose_headers = []
    }
}

// thumbnail bucket for resizing
resource "aws_s3_bucket" "thumbnail_bucket" {
    bucket = "thumbnail-uploader-bucket"
}

resource "aws_s3_bucket_public_access_block" "thumbnail_bucket_pab" {
    bucket = aws_s3_bucket.thumbnail_bucket.id

    block_public_acls = true
    block_public_policy = true
    ignore_public_acls = true
    restrict_public_buckets = true
}

resource "aws_s3_bucket_ownership_controls" "thumbnail_ownership" {
    bucket = aws_s3_bucket.thumbnail_bucket.id

    rule {
        object_ownership = "BucketOwnerEnforced"
    }
}

resource "aws_s3_bucket_cors_configuration" "thumbnail_cors" {
    bucket = aws_s3_bucket.thumbnail_bucket.id

    cors_rule {
        allowed_headers = ["*"]
        allowed_methods = ["GET", "PUT"]
        allowed_origins = ["*"]
        expose_headers = []
    }
}

resource "aws_iam_role" "lambda_execution_role" {
    name = "lambda-role"

    assume_role_policy = jsonencode({
        Version = "2012-10-17"
        Statement= [{
            Action = "sts:AssumeRole"
            Effect = "Allow"
            Principal = { Service: "lambda.amazonaws.com" }
        }]
    })
}

resource "aws_iam_role_policy" "lambda_s3_policy" {
    name = "lambda-s3-policy"
    role = aws_iam_role.lambda_execution_role.name

    policy = jsonencode({
        Version = "2012-10-17"
        Statement = [{
            Effect = "Allow"
            Action = ["s3:GetObject", "s3:PutObject"]
            Resource = ["${aws_s3_bucket.my_bucket.arn}/*", "${aws_s3_bucket.thumbnail_bucket.arn}/*"]
        }]
    })
}

resource "aws_lambda_function" "image_resizer" {
    filename = "../lambda/lambda_function.zip"
    function_name = "image_resizer"
    role = aws_iam_role.lambda_execution_role.arn
    handler = "index.handler"
    runtime = "nodejs22.x"
    source_code_hash = filebase64sha256("../lambda/lambda_function.zip")

    environment {
      variables = {
        AWS_S3_THUMBNAIL_BUCKET = aws_s3_bucket.thumbnail_bucket.id
      }
    }
}

resource "aws_s3_bucket_notification" "my_bucket_notification" {
    bucket = aws_s3_bucket.my_bucket.id

    lambda_function {
      lambda_function_arn = aws_lambda_function.image_resizer.arn
      events = ["s3:ObjectCreated:*"]
    }
}
