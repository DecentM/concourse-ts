import * as ConcourseTs from '@decentm/concourse-ts'
import * as RegistryImage from '@decentm/concourse-ts-resource-registry-image'

/**
 * https://github.com/concourse/s3-resource
 */
export type Source = {
  /**
   * The name of the bucket.
   */
  bucket: string
  /**
   * The AWS access key to use when accessing the bucket.
   */
  access_key_id?: string | ConcourseTs.Utils.Secret
  /**
   * The AWS secret key to use when accessing the bucket.
   */
  secret_access_key?: ConcourseTs.Utils.Secret
  /**
   * The AWS STS session token to use when accessing the bucket.
   */
  session_token?: ConcourseTs.Utils.Secret
  /**
   * The AWS role ARN to be assumed by the user identified by `access_key_id`
   * and `secret_access_key`.
   */
  aws_role_arn?: string | ConcourseTs.Utils.Secret
  /**
   * The region the bucket is in. Defaults to `us-east-1`.
   */
  region_name?: string
  /**
   * Indicates that the bucket is private, so that any URLs provided are signed.
   */
  private?: boolean
  /**
   * The URL (scheme and domain) of your CloudFront distribution that is
   * fronting this bucket (e.g `https://d5yxxxxx.cloudfront.net`).  This will
   * affect `in` but not `check` and `put`. `in` will ignore the `bucket` name
   * setting, exclusively using the `cloudfront_url`.  When configuring
   * CloudFront with versioned buckets, set `Query String Forwarding and
   * Caching` to `Forward all, cache based on all` to ensure S3 calls succeed.
   */
  cloudfront_url?: string
  /**
   * Custom endpoint for using S3 compatible provider.
   */
  endpoint?: string
  /**
   * Disable SSL for the endpoint, useful for S3 compatible providers without
   * SSL.
   */
  disable_ssl?: boolean
  /**
   * Skip SSL verification for S3 endpoint. Useful for S3 compatible providers
   * using self-signed SSL certificates.
   */
  skip_ssl_verification?: boolean
  /**
   * Skip downloading object from S3. Useful only trigger the pipeline without
   * using the object.
   */
  skip_download?: boolean
  /**
   * An encryption algorithm to use when storing objects in S3.
   */
  server_side_encryption?: string
  /**
   * The ID of the AWS KMS master encryption key used for the object.
   */
  sse_kms_key_id?: string | ConcourseTs.Utils.Secret
  /**
   * Use signature v2 signing, useful for S3 compatible providers that do not
   * support v4.
   */
  use_v2_signing?: boolean
  /**
   * Disable Multipart Upload. useful for S3 compatible providers that do not
   * support multipart upload.
   */
  disable_multipart?: boolean
}

export type GetParams = {
  /**
   * Skip downloading object from S3. Same parameter as source configuration but
   * used to define/override by get.
   */
  skip_download?: boolean
  /**
   * If true and the file is an archive (tar, gzipped tar, other gzipped file,
   * or zip), unpack the file. Gzipped tarballs will be both ungzipped and
   * untarred. It is ignored when `get` is running on the initial version.
   */
  unpack?: boolean
  /**
   * Write object tags to `tags.json`.
   */
  download_tags?: boolean
}

export type CannedACL =
  | 'private'
  | 'public-read'
  | 'public-read-write'
  | 'aws-exec-read'
  | 'authenticated-read'
  | 'bucket-owner-read'
  | 'bucket-owner-full-control'
  | 'log-delivery-write'

export type PutParams = {
  /**
   * Path to the file to upload, provided by an output of a task. If multiple
   * files are matched by the glob, an error is raised. The file which matches
   * will be placed into the directory structure on S3 as defined in `regexp` in
   * the resource definition. The matching syntax is bash glob expansion, so no
   * capture groups, etc.
   */
  file: string
  /**
   * [Canned
   * Acl](http://docs.aws.amazon.com/AmazonS3/latest/dev/acl-overview.html#canned-acl)
   * for the uploaded object.
   */
  acl?: CannedACL
  /**
   * MIME
   * [Content-Type](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.17)
   * describing the contents of the uploaded object
   */
  content_type?: string
}

export type Resource = ConcourseTs.Resource<Source, PutParams, GetParams>

export type ResourceType = ConcourseTs.ResourceType<
  'registry-image',
  RegistryImage.Source<'concourse/s3-resource'>
>
