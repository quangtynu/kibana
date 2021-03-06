/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { schema } from '@kbn/config-schema';
import { IRouter } from '../../../../core/server';

export function registerSearchRoute(router: IRouter): void {
  router.post(
    {
      path: '/internal/search/{strategy}',
      validate: {
        params: schema.object({ strategy: schema.string() }),

        query: schema.object({}, { allowUnknowns: true }),

        body: schema.object({}, { allowUnknowns: true }),
      },
    },
    async (context, request, res) => {
      const searchRequest = request.body;
      const strategy = request.params.strategy;
      try {
        const response = await context.search!.search(searchRequest, {}, strategy);
        return res.ok({ body: response });
      } catch (err) {
        return res.customError({
          statusCode: err.statusCode,
          body: {
            message: err.message,
            attributes: {
              error: err.body.error,
            },
          },
        });
      }
    }
  );
}
