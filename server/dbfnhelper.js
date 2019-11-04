const mkQuery = function(queryPhrase, pool) {
    const passParams = function(queryParams) {
        const queryFn = new Promise(
            (resolve, reject) => {
                pool.getConnection(
                    (err, conn) => {
                        if (err)
                            return reject(err);
                        conn.query(queryPhrase, queryParams || [],
                            (err, result) => {
                                conn.release();
                                if (err)
                                    return reject(err);
                                resolve(result);
                            }
                        )
                    }
                )
            }
        )
        return (queryFn);
    }
    return (passParams);
}

module.exports = mkQuery;